import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-middleware'
import { canAddSong, canInviteGuest, canExport, canAddCoOwner, getWeddingUsageStats } from '@/lib/tier-enforcement'
import { z } from 'zod'

const checkLimitSchema = z.object({
  weddingId: z.string(),
  action: z.enum(['add_song', 'invite_guest', 'export', 'add_coowner', 'get_stats'])
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = checkLimitSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { weddingId, action } = validation.data

    // Check the requested action
    let result
    switch (action) {
      case 'add_song':
        result = await canAddSong(weddingId)
        break
      
      case 'invite_guest':
        result = await canInviteGuest(weddingId)
        break
      
      case 'export':
        result = await canExport(weddingId)
        break
      
      case 'add_coowner':
        result = await canAddCoOwner(weddingId)
        break
      
      case 'get_stats':
        try {
          const stats = await getWeddingUsageStats(weddingId)
          return NextResponse.json({ success: true, stats })
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to get usage stats' },
            { status: 500 }
          )
        }
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error) {
    console.error('Error checking tier limits:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}