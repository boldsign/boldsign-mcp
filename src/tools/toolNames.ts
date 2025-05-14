enum ToolNames {
  // CONTACTS API
  /**
   * This tool utilizes the BoldSign API to retrieve detailed information for a specific contact within your organization.
   * To use this tool, you need to provide the unique identifier (ID) of the contact you wish to retrieve.
   * Contacts are primarily used to store signer details, identified by their unique email address,
   * for use when creating and sending documents for signature within the BoldSign application.
   */
  GetContact = 'get_contact',
  /**
   * This tool allows you to retrieve a paginated list of contacts from your BoldSign organization.
   * You can specify the page number to navigate through the results, the number of contacts to display per page,
   * an optional search term to filter contacts, and the type of contacts to retrieve (your personal contacts or all organizational contacts).
   * Contacts are primarily used to store signer details, identified by their unique email address,
   * for use when creating and sending documents for signature within the BoldSign application.
   */
  ListContacts = 'list_contacts',
  // USERS API
  /**
   * Retrieves detailed information for a specific BoldSign user based on their unique user ID.
   */
  GetUser = 'get_user',
  /**
   * Retrieves a paginated list of BoldSign users, with optional filtering by a search term.
   */
  ListUsers = 'list_users',
  // TEAMS API
  /**
   * Retrieve detailed information about an existing team in your BoldSign organization.
   * This API provides access to team-specific properties, such as team name, users, creation date, and modification date,
   * by specifying the unique team ID.
   */
  GetTeam = 'get_team',
  /**
   * Retrieve a paginated list of teams within your BoldSign organization.
   * This API fetches team details such as team name, users, creation date, and modification date for all listed teams,
   * with options for filtering using a search term and navigating through pages of results.
   */
  ListTeams = 'list_teams',
  // DOCUMENTS API
  /**
   * Retrieve comprehensive details of a document in your BoldSign organization.
   * This API allows authorized users, including senders, signers, team admins, and account admins,
   * to access document properties by specifying the unique document ID.
   * The response includes information such as status, metadata, sender and signer details, form fields, and document history.
   * If an unauthorized user attempts to access the document, an unauthorized response will be returned.
   */
  GetDocumentProperties = 'get_document_properties',
  /**
   * Retrieve a paginated list of documents available in your My Documents section.
   * This API fetches document details such as status, sender, recipient, labels, transmission type, creation date, and modification date,
   * with options for filtering and paginated navigation.
   */
  ListDocuments = 'list_documents',
  /**
   * Retrieve a paginated list of documents available in the Team Documents section of your BoldSign organization.
   * Team admins can view documents sent and received by team members, while account admins have access to all team documents across the organization.
   * This API allows filtering based on status, user ID, team ID, document details, transmission type, and date range.
   * If the user is not an account admin or team admin, an unauthorized response will be returned.
   */
  ListTeamDocuments = 'list_team_documents',
  /**
   * Send reminder emails to signers for pending document signatures.
   * This API allows users to remind signers about outstanding signature requests by specifying the document ID and recipient email addresses.
   * Multiple signers can receive reminders at once, and custom messages can be included.
   * If sending reminders on behalf of another sender, specify the relevant sender email addresses.
   */
  SendReminderForDocumentSign = 'send_reminder_for_document_sign',
  /**
   * The document signing process can be called off or revoked by the sender of the document.
   * Once you revoke a document, signers can no longer view or sign it.
   * Revoke action can only be performed on documents that have not completed the signing process.
   */
  RevokeDocument = 'revoke_document',
  // TEMPLATES API
  /**
   * Retrieves the detailed properties and settings of a specific BoldSign template using its unique template ID.
   */
  GetTemplateProperties = 'get_template_properties',
  /**
   * Retrieves a paginated list of BoldSign templates with options to filter by page number, page size, search key, template type, creator, labels, creation date range, and brand IDs.
   */
  ListTemplates = 'list_templates',
  /**
   * Initiates the process of sending a document based on a pre-defined template.
   * This tool allows you to specify recipients, form field values, and various sending options to create and send a document for signing.
   */
  SendDocumentFromTemplate = 'send_document_from_template',
}

export default ToolNames;
