import { prisma } from '@documenso/prisma';
import type { Prisma } from '@documenso/prisma/client';

export type FindTemplatesSortType = 'date' | 'asc' | 'desc';

export type FindTemplatesOptions = {
  userId: number;
  teamId?: number;
  page: number;
  perPage: number;
  sortBy?: FindTemplatesSortType;
};

export const findTemplates = async ({
  userId,
  teamId,
  page = 1,
  perPage = 10,
  sortBy = 'desc',
}: FindTemplatesOptions) => {
  let whereFilter: Prisma.TemplateWhereInput = {
    userId,
    teamId: null,
  };

  if (teamId !== undefined) {
    whereFilter = {
      team: {
        id: teamId,
        members: {
          some: {
            userId,
          },
        },
      },
    };
  }

  const [templates, count] = await Promise.all([
    prisma.template.findMany({
      where: whereFilter,
      include: {
        templateDocumentData: true,
        Field: true,
      },
      skip: Math.max(page - 1, 0) * perPage,
      orderBy: {
        ...(sortBy === 'date'
          ? {
              createdAt: 'desc',
            }
          : {
              title: sortBy === 'asc' ? 'asc' : 'desc',
            }),
      },
    }),
    prisma.template.count({
      where: whereFilter,
    }),
  ]);

  return {
    templates,
    totalPages: Math.ceil(count / perPage),
  };
};
