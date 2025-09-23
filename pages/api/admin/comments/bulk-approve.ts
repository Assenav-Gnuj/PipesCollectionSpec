import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PATCH') {
    try {
      const { commentIds } = req.body;

      if (!Array.isArray(commentIds) || commentIds.length === 0) {
        return res.status(400).json({ error: 'Comment IDs array is required' });
      }

      // Update all comments in batch
      const updateResult = await prisma.comment.updateMany({
        where: {
          id: {
            in: commentIds,
          },
        },
        data: {
          isApproved: true,
          moderatedBy: session.user?.email || 'admin',
          moderatedAt: new Date(),
        },
      });

      res.status(200).json({ 
        message: `${updateResult.count} comments approved successfully`,
        updatedCount: updateResult.count 
      });
    } catch (error) {
      console.error('Error bulk approving comments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}