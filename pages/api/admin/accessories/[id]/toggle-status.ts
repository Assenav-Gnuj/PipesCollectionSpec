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
    return res.status(400).json({ message: 'Invalid accessory ID' });
  }

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean' });
    }

    const accessory = await prisma.accessory.update({
      where: { id },
      data: { isActive },
    });

    return res.status(200).json(accessory);
  } catch (error) {
    console.error('Error updating accessory status:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'Accessory not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}