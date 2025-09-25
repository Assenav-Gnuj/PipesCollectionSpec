import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Comment ID is required' });
  }

  if (req.method === 'PATCH') {
    try {
      const { isApproved } = req.body;

      const comment = await prisma.comment.update({
        where: { id },
        data: {
          isApproved,
          moderatedBy: session.user?.email || 'admin',
          moderatedAt: new Date(),
        },
      });

      res.status(200).json(comment);
    } catch (error) {
      console.error('Error rejecting comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}