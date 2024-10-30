import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects'
import WithInputPlugin from '@pothos/plugin-with-input'
import ValidationPlugin from '@pothos/plugin-zod'
import { DateTimeResolver } from 'graphql-scalars'
import prisma from '../lib/prisma'

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Scalars: { DateTime: { Input: Date; Output: Date } }
  DefaultFieldNullability: false
}>({
  plugins: [PrismaPlugin, WithInputPlugin, SimpleObjectsPlugin, ValidationPlugin],
  defaultFieldNullability: false,
  prisma: {
    client: prisma,
  },
})

builder.queryType()
builder.mutationType()

builder.addScalarType('DateTime', DateTimeResolver)
