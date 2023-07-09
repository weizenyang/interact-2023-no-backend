export const config = {
  local_backend: {
    url: "http://localhost:8082/api/v1",
    allowed_hosts: ['192.168.0.1']
  },
  backend: {
    name: "git-gateway",
    branch: "main"
  },
  publish_mode: "editorial_workflow",
  media_folder: "/public",
  public_folder: "/public",
  collections: [
    {
      name: "submissions",
      label: "Submissions",
      folder: "/public/data/submissions_data",
      extension: "json",
      format: "json",
      create: true,
      slug: "{title}",
      fields: [
        {
          label: "Layout",
          name: "layout",
          widget: "hidden",
          default: "blog"
        },
        {
          label: "ID",
          name: "id",
          widget: "string"
        },
        {
          label: "Publish Date",
          name: "date",
          widget: "datetime"
        },
        {
          label: "Title",
          name: "title",
          widget: "string"
        },
        {
          label: "Description",
          name: "description",
          widget: "markdown"
        },
        {
          label: "Details",
          name: "details",
          widget: "markdown"
        },
        {
          label: "Link",
          name: "link",
          widget: "string",
          required: false
        }
      ]
    },
    {
      name: "workshops",
      label: "Workshops",
      folder: "/src/data/programme_data",
      extension: "json",
      format: "json",
      create: true,
      slug: "programmes",
      fields: [
        {
          label: "Layout",
          name: "layout",
          widget: "hidden",
          default: "blog"
        },
        {
          label: "ID (set to 0)",
          name: "id",
          widget: "string",
          default: 0
        },
        {
          label: "Publish Date",
          name: "date",
          widget: "datetime"
        },
        {
          label: "Title",
          name: "title",
          widget: "string"
        },
        {
          label: "Date",
          name: "date_widget",
          widget: "string"
        },
        {
          label: "Description",
          name: "description",
          widget: "markdown"
        },
        {
          label: "Website",
          name: "website",
          widget: "string",
          required: false
        },
        {
          label: "Contacts",
          name: "contacts",
          widget: "markdown"
        },
        {
          label: "Event period",
          name: "event_period",
          widget: "markdown"
        },
        {
          label: "Mode",
          name: "mode",
          widget: "markdown"
        }
      ]
    }
  ]
}