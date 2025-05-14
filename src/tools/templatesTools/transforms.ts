import { Template } from 'boldsign';

export function setAsTemplate(templates?: Array<Template>) {
  templates?.forEach((template: Template) => (template.isTemplate = true));
}
