import { DocumentCreated, Role, SendForSignFromTemplateForm, TemplateApi } from 'boldsign';
import { z } from 'zod';
import * as commonSchema from '../../utils/commonSchema.js';
import { configuration } from '../../utils/constants.js';
import { handleMcpError, handleMcpResponse } from '../../utils/toolsUtils.js';
import { BoldSignTool, McpResponse } from '../../utils/types.js';
import ToolNames from '../toolNames.js';

const SignerDetailsSchema = z
  .object({
    signerName: z.string().describe('The name of the signer assigned to this role.'),
    signerOrder: commonSchema.OptionalIntegerSchema.describe(
      "The sequential order in which the signers in this role need to sign the document. Only relevant when 'enableSigningOrder' is true.",
    ),
    signerEmail: z
      .string()
      .describe(
        'The email address of the signer assigned to this role. This is where the signing invitation will be sent.',
      ),
  })
  .optional()
  .nullable()
  .describe('Optional. The signer information for a template role.');

const ExistingFormFieldsSchema = z
  .array(
    z.object({
      index: commonSchema.IntegerSchema.optional().describe(
        'The index of an existing form field to be updated.',
      ),
      name: commonSchema.OptionalStringSchema.describe('Optional name of the existing form field.'),
      id: commonSchema.InputIdSchema.optional()
        .nullable()
        .describe('The unique identifier (ID) of the existing form field to be updated.'),
      value: commonSchema.OptionalStringSchema.describe('Optional value of the existing form field.'),
      isReadOnly: commonSchema.OptionalBooleanSchema.describe(
        'Decides whether this form field is read only or not.',
      ),
    }),
  )
  .optional()
  .nullable()
  .describe(
    'Optional. An array of existing form fields to be updated in the document for a role. When needed this information can be fetch from the get template tool to find the fillable form field for each signers.',
  );

const RolesSchema = z
  .array(
    z.object({
      signerDetails: SignerDetailsSchema,
      roleIndex: z
        .number()
        .min(1)
        .max(50)
        .describe(
          'The index of the role, indicating the position of the signer in the signing process. Must be between 1 and 50.',
        ),
      privateMessage: commonSchema.OptionalStringSchema.describe(
        'Displays a private message to the specified signer when they proceed to sign the document. You can include the instructions that the signer should know before signing the document.',
      ),
      authenticationCode: commonSchema.OptionalStringSchema.describe(
        'The authentication access code that the signer must enter to access the document. This should be shared with the signer privately by the sender.',
      ),
      enableEmailOTP: commonSchema.OptionalBooleanSchema.describe(
        "A flag indicating whether One-Time Password (OTP) via email should be enabled for this signer's authentication.",
      ),
      authenticationType: z
        .enum([
          Role.AuthenticationTypeEnum.None.toString(),
          Role.AuthenticationTypeEnum.EmailOtp.toString(),
          Role.AuthenticationTypeEnum.AccessCode.toString(),
          Role.AuthenticationTypeEnum.Smsotp.toString(),
        ])
        .optional()
        .nullable()
        .default(Role.AuthenticationTypeEnum.None.toString())
        .describe(
          'This is used to allow authentication for a specific signer. We have three types of authentication. They are AccessCode and EmailOTP. The default value is None.',
        ),
      phoneNumber: commonSchema.OptionalPhoneNumberWithCodeSchema.describe(
        'The phone number of the signer, including the country code. Required for SMS authentication.',
      ),
      deliveryMode: z
        .enum([Role.DeliveryModeEnum.Email.toString(), Role.DeliveryModeEnum.Sms.toString()])
        .optional()
        .nullable()
        .describe(
          "The method by which the document should be delivered to the signer (e.g., 'Email', 'SMS'). When SMS is enabled, you should also provide the phone number.",
        ),
      signerType: z
        .enum([Role.SignerTypeEnum.Signer.toString(), Role.SignerTypeEnum.Reviewer.toString()])
        .optional()
        .nullable()
        .describe("The type of signer (e.g., 'Signer', 'Reviewer')."),
      signerRole: commonSchema.OptionalStringSchema.describe(
        'Optional. The user defined role of the signer, which was specified while creating the template.',
      ),
      allowFieldConfiguration: commonSchema.OptionalBooleanSchema.describe(
        'This option enables the signer to add fields at their end while signing the document. If this option is set to false, the signer cannot add fields, and they must complete the assigned ones. By default, it is set to false.',
      ),
      existingFormFields: ExistingFormFieldsSchema,
      enableQes: commonSchema.OptionalBooleanSchema.describe(
        'A flag indicating whether Qualified Electronic Signature (QES) should be enabled for this signer.',
      ),
    }),
  )
  .optional()
  .nullable()
  .describe('Optional. An array defining the roles and associated signers for the document.');

const SendDocumentFromTemplateSchema = z.object({
  templateId: commonSchema.InputIdSchema.describe(
    'Required. The unique identifier (ID) of the template to be used for sending the document. This can be obtained from the list templates tool.',
  ),
  body: z
    .object({
      title: commonSchema.OptionalStringSchema.describe(
        'This is the title of the document that will be displayed in the BoldSign user interface as well as in the signature request email.',
      ),
      message: commonSchema.OptionalStringSchema.describe(
        'A message for all the recipients. You can include the instructions that the signer should know before signing the document.',
      ),
      fileUrls: z
        .array(commonSchema.FileUrlSchema)
        .max(25)
        .optional()
        .nullable()
        .describe('Optional. An array of URLs pointing to additional files to be attached to the document.'),
      roles: RolesSchema,
      cc: z
        .array(
          z
            .object({
              emailAddress: z.string().email().describe('Email address of the CC recipient.'),
            })
            .describe('Email address of the CC recipients.'),
        )
        .optional()
        .nullable()
        .describe(
          'Optional. An array of email addresses to be added as carbon copy (CC) recipients to the document. CC recipients will receive a copy of the completed document.',
        ),
      brandId: commonSchema.InputIdSchema.optional()
        .nullable()
        .describe(
          'The unique identifier (ID) of the brand to be associated with this document. If provided, the document will be branded accordingly.',
        ),
      disableEmails: commonSchema.OptionalBooleanSchema.describe(
        'Disables the sending of document related emails to all the recipients. The default value is false.',
      ),
      disableSMS: commonSchema.OptionalBooleanSchema.describe(
        'Disables the sending of document related SMS to all the recipients. The default value is false.',
      ),
      hideDocumentId: commonSchema.OptionalBooleanSchema.describe(
        'Decides whether the document ID should be hidden or not.',
      ),
      reminderSettings: z
        .object({
          enableAutoReminder: commonSchema.OptionalBooleanSchema.describe(
            'A flag indicating whether automatic reminders should be enabled for this document.',
          ),
          reminderDays: commonSchema.OptionalIntegerSchema.describe(
            'The number of days after which a reminder should be sent to the signers.',
          ),
          reminderCount: commonSchema.OptionalIntegerSchema.describe(
            'The maximum number of reminders to be sent to the signers.',
          ),
        })
        .optional()
        .nullable()
        .describe('Optional. Settings for automated reminders to be sent to the signers.'),
      expiryDays: commonSchema.OptionalIntegerSchema.default(60).describe(
        'The number of days after which the document expires. The default value is 60 days.',
      ),
      enablePrintAndSign: commonSchema.OptionalBooleanSchema.describe(
        'Allows the signer to print the document, sign, and upload it. The default value is false.',
      ),
      enableReassign: commonSchema.OptionalBooleanSchema.describe(
        'Allows the signer to reassign the signature request to another person. The default value is true.',
      ),
      enableSigningOrder: commonSchema.OptionalBooleanSchema.describe(
        'Enables or disables the signing order. If this option is enabled, then the signers can only sign the document in the specified order and cannot sign in parallel. The default value is false.',
      ),
      disableExpiryAlert: commonSchema.OptionalBooleanSchema.describe(
        'Disables the alert, which was shown one day before the expiry of the document.',
      ),
      scheduledSendTime: commonSchema.OptionalIntegerSchema.describe(
        "This property allows you to specify the date and time in Unix Timestamp format to schedule a document for sending at a future time. The scheduled time must be at least 30 minutes from the current time and must not exceed the document's expiry date.",
      ),
      allowScheduledSend: commonSchema.OptionalIntegerSchema.describe(
        'Indicates whether scheduled sending is allowed for this document (e.g., 1 for allowed, 0 for not allowed).',
      ),
    })
    .describe('Optional. The main content and settings for sending the document.'),
});

type SendDocumentFromTemplateSchemaType = z.infer<typeof SendDocumentFromTemplateSchema>;

export const sendDocumentFromTemplateDynamicToolDefinition: BoldSignTool = {
  method: ToolNames.SendDocumentFromTemplate.toString(),
  name: 'Send document from template',
  description:
    'Initiates the process of sending a document based on a pre-defined template. This tool allows you to specify recipients, form field values, and various sending options to create and send a document for signing.',
  inputSchema: SendDocumentFromTemplateSchema,
  async handler(args: unknown): Promise<McpResponse> {
    return await sendDocumentFromTemplateDynamicHandler(args as SendDocumentFromTemplateSchemaType);
  },
};

async function sendDocumentFromTemplateDynamicHandler(
  payload: SendDocumentFromTemplateSchemaType,
): Promise<McpResponse> {
  try {
    const templateApi = new TemplateApi();
    templateApi.basePath = configuration.getBasePath();
    templateApi.setApiKey(configuration.getApiKey());
    const roles = getRolesFromRequestPayload(payload);
    const documentCreated: DocumentCreated = await templateApi.sendUsingTemplate(payload.templateId, {
      fileUrls: payload.body.fileUrls,
      title: payload.body.title ?? undefined,
      message: payload.body.message ?? undefined,
      roles: roles,
      brandId: payload.body.brandId ?? undefined,
      disableEmails: payload.body.disableEmails ?? undefined,
      disableSMS: payload.body.disableSMS ?? undefined,
      hideDocumentId: payload.body.hideDocumentId ?? undefined,
      reminderSettings: payload.body.reminderSettings ?? undefined,
      cc: payload.body.cc ?? undefined,
      expiryDays: payload.body.expiryDays ?? undefined,
      enablePrintAndSign: payload.body.enablePrintAndSign ?? undefined,
      enableReassign: payload.body.enableReassign ?? undefined,
      enableSigningOrder: payload.body.enableSigningOrder ?? undefined,
      disableExpiryAlert: payload.body.disableExpiryAlert ?? undefined,
      scheduledSendTime: payload.body.scheduledSendTime ?? undefined,
      allowScheduledSend: payload.body.allowScheduledSend ?? undefined,
    } as SendForSignFromTemplateForm);
    return handleMcpResponse({
      data: documentCreated,
    });
  } catch (error: any) {
    return handleMcpError(error);
  }
}

function getRolesFromRequestPayload(payload: SendDocumentFromTemplateSchemaType): Array<Role> {
  const roles = new Array<Role>();
  payload?.body.roles?.forEach((requestRole) => {
    const role = new Role();
    role.roleIndex = requestRole.roleIndex ?? undefined;
    role.signerName = requestRole.signerDetails?.signerName ?? undefined;
    role.signerOrder = requestRole.signerDetails?.signerOrder ?? undefined;
    role.signerEmail = requestRole.signerDetails?.signerEmail ?? undefined;
    role.privateMessage = requestRole.privateMessage ?? undefined;
    role.authenticationCode = requestRole.authenticationCode ?? undefined;
    role.enableEmailOTP = requestRole.enableEmailOTP ?? undefined;
    role.authenticationType = requestRole.authenticationType
      ? (requestRole.authenticationType as unknown as Role.AuthenticationTypeEnum)
      : undefined;
    role.phoneNumber = requestRole.phoneNumber ?? undefined;
    role.deliveryMode = requestRole.deliveryMode
      ? (requestRole.deliveryMode as unknown as Role.DeliveryModeEnum)
      : undefined;
    role.signerType = requestRole.signerType
      ? (requestRole.signerType as unknown as Role.SignerTypeEnum)
      : undefined;
    role.signerRole = requestRole.signerRole ?? undefined;
    role.allowFieldConfiguration = requestRole.allowFieldConfiguration ?? undefined;
    role.existingFormFields = requestRole.existingFormFields ?? undefined;
    role.enableQes = requestRole.enableQes ?? undefined;
    roles.push(role);
  });
  return roles;
}
