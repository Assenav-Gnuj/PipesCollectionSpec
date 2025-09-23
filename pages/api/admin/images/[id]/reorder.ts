import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid image ID' });
  }

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sortOrder } = req.body;

    if (typeof sortOrder !== 'number' || sortOrder < 1) {
      return res.status(400).json({ message: 'Invalid sort order' });
    }

    const image = await prisma.image.update({
      where: { id },
      data: { sortOrder },
    });

    return res.status(200).json(image);
  } catch (error) {
    console.error('Error updating image sort order:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'Image not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}