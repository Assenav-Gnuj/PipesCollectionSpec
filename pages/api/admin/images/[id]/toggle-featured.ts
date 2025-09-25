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
    return res.status(400).json({ error: 'Image ID is required' });
  }

  if (req.method === 'PATCH') {
    try {
      const { isFeatured } = req.body;

      const image = await prisma.image.update({
        where: { id },
        data: { isFeatured },
      });

      res.status(200).json(image);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}