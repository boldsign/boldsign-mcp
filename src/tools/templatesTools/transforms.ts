import { Template } from 'boldsign';

export function setAsTemplate(templates?: Array<Template> | null) {
  templates?.forEach((template: Template) => (template.isTemplate = true));
}
