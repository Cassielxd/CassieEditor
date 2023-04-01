export default {
  type: "doc",
  attrs: { meta: {} },
  content: [
    {
      type: "paragraph",
      attrs: { class: null },
      content: [
        { type: "text", text: "This is a " },
        { type: "text", marks: [{ type: "strong" }], text: "test" },
        { type: "text", text: " with some additional content." }
      ]
    },
    {
      type: "paragraph",
      attrs: { class: null },
      content: [
        {
          type: "text",
          text: "There’s, surprisingly, another paragraph here, too"
        }
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
              content: [
                { type: "text", text: "Here is a " },
                {
                  type: "text",
                  marks: [{ type: "em" }, { type: "strong" }],
                  text: "list"
                }
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
                      content: [{ type: "text", text: "It has another item" }]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              attrs: { class: null },
              content: [{ type: "text", text: "Here is yet another item" }]
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
                      content: [
                        { type: "text", text: "Here is a first sub-item" }
                      ]
                    }
                  ]
                },
                {
                  type: "list_item",
                  content: [
                    {
                      type: "paragraph",
                      attrs: { class: null },
                      content: [
                        { type: "text", text: "Here is another sub-item" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              attrs: { class: null },
              content: [
                {
                  type: "text",
                  text: "Can you believe how many items we have to list?"
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
      content: [
        {
          type: "text",
          text: "One more paragraph for all of you lovely people"
        }
      ]
    },
    {
      type: "paragraph",
      attrs: { class: null },
      content: [{ type: "text", text: "Okay, I lied, two more" }]
    },
    { type: "paragraph", attrs: { class: null } }
  ]
};
