import { z } from 'zod';

export const InputIdSchema: z.ZodString = z.string();

export const IntegerSchema: z.ZodNumber = z.number().int();

export const OptionalStringSchema: z.ZodNullable<z.ZodOptional<z.ZodString>> = z
  .string()
  .optional()
  .nullable();

export const OptionalIntegerSchema: z.ZodNullable<z.ZodOptional<z.ZodNumber>> = z
  .number()
  .optional()
  .nullable();

export const OptionalBooleanSchema: z.ZodNullable<z.ZodOptional<z.ZodDefault<z.ZodBoolean>>> = z
  .boolean()
  .default(false)
  .optional()
  .nullable();

export const EmailSchema: z.ZodString = z.string().email();

export const OptionalPhoneNumberWithCodeSchema = z
  .object({
    countryCode: z.string().describe('Country code.'),
    number: z.string().describe('Phone number.'),
  })
  .optional()
  .nullable();

export const OptionalPageSizeSchema = z.number().int().min(1).max(100).optional().nullable();

export const OptionalDateSchema: z.ZodNullable<z.ZodOptional<z.ZodDate>> = z.date().optional().nullable();

export const FileUrlSchema = z
  .string()
  .nonempty()
  .url()
  .describe(
    'The URL of the file must be publicly accessible. The supported file formats are .pdf, .png, .jpg, and .docx. The preferred file format is .pdf. You can upload up to 25 files. Each document may have a maximum of 1000 pages and must be no larger than 25 MB in size.',
  );

export const PhoneNumberWithCodeSchema = z.object({
  countryCode: z.string().describe('Country code.'),
  number: z.string().describe('Phone number.'),
});

export const PageSizeSchema = z.number().int().min(1).max(100);
export const PageSchema = z.number().int().min(1).default(1);

// Metadata related schema.

const MetadataKeySchema: z.ZodString = z
  .string({ message: 'Must be a valid metadata key.' })
  .trim()
  .min(1)
  .max(40)
  .describe('Unique key representing a metadata value.');

const MetadataValueSchema: z.ZodString = z
  .string({ message: 'Must be a valid metadata value.' })
  .trim()
  .min(1)
  .max(500)
  .describe('Value belonging to a metadata key.');

const MetadataUpdateValueSchema: z.ZodString = z
  .string({ message: 'Must be a valid metadata value.' })
  .max(500)
  .describe('Value belonging to a metadata key.');

const metadataDescription: string =
  "Metadata contains relatable information. Metadata key is removed by setting the value as empty string. Metadata pairs can be deleted by setting an empty string as the new value for keys. A value is updated, by providing a new value for it's respective key.";

export const OptionalMetadataSchema = z
  .record(MetadataKeySchema, MetadataValueSchema)
  .optional()
  .nullable()
  .describe(`Optional. ${metadataDescription}`);

export const OptionalMetadataUpdateSchema = z
  .record(MetadataKeySchema, MetadataUpdateValueSchema)
  .optional()
  .nullable()
  .describe(`Optional. ${metadataDescription}`);

export const MetadataSchema = z.record(MetadataKeySchema, MetadataValueSchema).describe(metadataDescription);

export const MetadataUpdateSchema = z
  .record(MetadataKeySchema, MetadataUpdateValueSchema)
  .describe(metadataDescription);
