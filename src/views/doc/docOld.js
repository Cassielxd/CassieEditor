export default {
  type: "doc",
  attrs: { meta: {} },
  content: [
    {
      type: "paragraph",
      attrs: { class: null },
      content: [
        { type: "text", text: "This is a " },
        { type: "text", marks: [{ type: "strong" }], text: "test pub" },
        { type: "text", text: " with some " },
        { type: "text", marks: [{ type: "em" }], text: "content" }
      ]
    },
    {
      type: "bullet_list",
      content: [
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              attrs: { class: null },
              content: [{ type: "text", text: "Here is a list" }]
            }
          ]
        },
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              attrs: { class: null },
              content: [{ type: "text", text: "Here is another item" }]
            },
            {
              type: "bullet_list",
              content: [
                {
                  type: "list_item",
                  content: [
                    {
                      type: "paragraph",
                      attrs: { class: null },
                      content: [{ type: "text", text: "Here is a sub-item" }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      attrs: { class: null },
      content: [{ type: "text", text: "One more paragraph for you fiends" }]
    },
    { type: "paragraph", attrs: { class: null } }
  ]
};
