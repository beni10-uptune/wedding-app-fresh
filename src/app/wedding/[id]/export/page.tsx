'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { 
  Download, FileText, Music, Headphones, 
  CheckCircle, Clock, Calendar, MapPin,
  Heart, ArrowLeft, Loader2, Copy,
  Share2, Mail
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { jsPDF } from 'jspdf'

interface Wedding {
  id: string
  title: string
  coupleNames: string[]
  weddingDate: any
  venue?: string
  city?: string
}

interface Playlist {
  id: string
  name: string
  description: string
  moment: string
  songs: Song[]
}

interface Song {
  id: string
  title: string
  artist: string
  album?: string
  duration_ms?: number
  addedBy?: string
  addedByName?: string
  spotify_id?: string
}

export default function ExportPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState<'pdf' | 'spotify'>('pdf')
  const [includeDetails, setIncludeDetails] = useState({
    timing: true,
    addedBy: true,
    duration: true
  })
  const [exporting, setExporting] = useState(false)
  const [exportUrl, setExportUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user && id) {
      loadWeddingAndPlaylists()
    }
  }, [user, id])

  const loadWeddingAndPlaylists = async () => {
    try {
      // Load wedding
      const weddingDoc = await getDoc(doc(db, 'weddings', id as string))
      if (weddingDoc.exists()) {
        const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as Wedding
        setWedding(weddingData)
      }

      // Load playlists with songs
      const playlistsSnapshot = await getDocs(
        collection(db, 'weddings', id as string, 'playlists')
      )
      
      const playlistPromises = playlistsSnapshot.docs.map(async (playlistDoc) => {
        const songsSnapshot = await getDocs(
          collection(db, 'weddings', id as string, 'playlists', playlistDoc.id, 'songs')
        )
        
        const songs = songsSnapshot.docs.map(songDoc => ({
          id: songDoc.id,
          ...songDoc.data()
        })) as Song[]
        
        return {
          id: playlistDoc.id,
          ...playlistDoc.data(),
          songs
        } as Playlist
      })
      
      const playlistData = await Promise.all(playlistPromises)
      setPlaylists(playlistData)
      setSelectedPlaylists(playlistData.map(p => p.id))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const generatePDF = async () => {
    setExporting(true)
    try {
      const pdf = new jsPDF()
      let yPosition = 20
      
      // Header
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${wedding?.coupleNames[0]} & ${wedding?.coupleNames[1]}`, 105, yPosition, { align: 'center' })
      
      yPosition += 10
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Wedding Playlist', 105, yPosition, { align: 'center' })
      
      yPosition += 10
      pdf.setFontSize(12)
      if (wedding?.weddingDate) {
        const date = new Date(wedding.weddingDate.seconds ? wedding.weddingDate.seconds * 1000 : wedding.weddingDate)
        pdf.text(date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }), 105, yPosition, { align: 'center' })
      }
      
      if (wedding?.venue) {
        yPosition += 6
        pdf.text(`${wedding.venue}${wedding.city ? `, ${wedding.city}` : ''}`, 105, yPosition, { align: 'center' })
      }
      
      yPosition += 15
      
      // Selected playlists
      const selectedPlaylistData = playlists.filter(p => selectedPlaylists.includes(p.id))
      
      for (const playlist of selectedPlaylistData) {
        // Check if we need a new page
        if (yPosition > 250) {
          pdf.addPage()
          yPosition = 20
        }
        
        // Playlist header
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text(playlist.name, 20, yPosition)
        yPosition += 8
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'italic')
        pdf.text(playlist.description || '', 20, yPosition)
        yPosition += 10
        
        // Songs
        pdf.setFont('helvetica', 'normal')
        playlist.songs.forEach((song, index) => {
          if (yPosition > 270) {
            pdf.addPage()
            yPosition = 20
          }
          
          pdf.setFontSize(11)
          let songText = `${index + 1}. ${song.title} - ${song.artist}`
          
          if (includeDetails.duration && song.duration_ms) {
            songText += ` (${formatDuration(song.duration_ms)})`
          }
          
          pdf.text(songText, 25, yPosition)
          
          if (includeDetails.addedBy && song.addedByName) {
            yPosition += 5
            pdf.setFontSize(9)
            pdf.setTextColor(128, 128, 128)
            pdf.text(`Added by: ${song.addedByName}`, 30, yPosition)
            pdf.setTextColor(0, 0, 0)
          }
          
          yPosition += 8
        })
        
        yPosition += 10
      }
      
      // Save PDF
      const pdfBlob = pdf.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      setExportUrl(url)
      
      // Auto download
      const link = document.createElement('a')
      link.href = url
      link.download = `${wedding?.coupleNames[0]}_${wedding?.coupleNames[1]}_Wedding_Playlist.pdf`
      link.click()
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setExporting(false)
    }
  }

  const exportToSpotify = async () => {
    setExporting(true)
    try {
      // TODO: Implement Spotify playlist creation
      // This would require OAuth flow and user authentication
      alert('Spotify export coming soon! For now, you can use the PDF export and manually create your playlist.')
    } finally {
      setExporting(false)
    }
  }

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      generatePDF()
    } else {
      exportToSpotify()
    }
  }

  const togglePlaylistSelection = (playlistId: string) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlistId)
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    )
  }

  const getMomentIcon = (moment: string) => {
    switch (moment) {
      case 'ceremony': return '💒'
      case 'cocktail': return '🍸'
      case 'dinner': return '🍽️'
      case 'first-dance': return '💕'
      case 'party': return '🎉'
      default: return '🎵'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading playlists...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark-gradient">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/wedding/${id}`} className="text-white/60 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-serif font-bold text-white">Export for DJ</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Export Options */}
        <div className="glass-gradient rounded-3xl p-8 mb-8">
          <h2 className="text-3xl font-serif font-bold text-white mb-6 flex items-center gap-3">
            <Download className="w-8 h-8 text-purple-400" />
            Export Your Wedding Playlist
          </h2>

          {/* Format Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Export Format</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 hover:border-purple-400'
                }`}
              >
                <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="font-bold text-white">PDF Document</h4>
                <p className="text-sm text-white/60 mt-1">
                  Professional printable format for your DJ
                </p>
              </button>
              
              <button
                onClick={() => setExportFormat('spotify')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  exportFormat === 'spotify'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 hover:border-purple-400'
                }`}
              >
                <Music className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="font-bold text-white">Spotify Playlist</h4>
                <p className="text-sm text-white/60 mt-1">
                  Direct export to Spotify (Coming Soon)
                </p>
              </button>
            </div>
          </div>

          {/* Playlist Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Select Playlists to Export</h3>
            <div className="space-y-3">
              {playlists.map(playlist => (
                <label
                  key={playlist.id}
                  className="flex items-center gap-3 p-4 glass-darker rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlaylists.includes(playlist.id)}
                    onChange={() => togglePlaylistSelection(playlist.id)}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMomentIcon(playlist.moment)}</span>
                      <h4 className="font-bold text-white">{playlist.name}</h4>
                      <span className="text-sm text-white/60">({playlist.songs.length} songs)</span>
                    </div>
                    <p className="text-sm text-white/60 mt-1">{playlist.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          {exportFormat === 'pdf' && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Include in Export</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeDetails.duration}
                    onChange={(e) => setIncludeDetails(prev => ({ ...prev, duration: e.target.checked }))}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white">Song duration</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeDetails.addedBy}
                    onChange={(e) => setIncludeDetails(prev => ({ ...prev, addedBy: e.target.checked }))}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white">Who added each song</span>
                </label>
              </div>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={exporting || selectedPlaylists.length === 0}
            className="btn-primary w-full text-lg py-4"
          >
            {exporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Export...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export {exportFormat === 'pdf' ? 'as PDF' : 'to Spotify'}
              </>
            )}
          </button>

          {selectedPlaylists.length === 0 && (
            <p className="text-sm text-red-400 text-center mt-2">
              Please select at least one playlist to export
            </p>
          )}
        </div>

        {/* Export Preview */}
        {selectedPlaylists.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Export Preview</h3>
            <div className="text-white/60">
              <p>
                <span className="font-medium text-white">{selectedPlaylists.length}</span> playlists selected
              </p>
              <p>
                <span className="font-medium text-white">
                  {playlists
                    .filter(p => selectedPlaylists.includes(p.id))
                    .reduce((acc, p) => acc + p.songs.length, 0)}
                </span> total songs
              </p>
              {exportFormat === 'pdf' && (
                <p className="mt-2 text-sm">
                  Your PDF will be formatted professionally for easy reading by your DJ
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}