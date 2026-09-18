// Wraps Markdown tables in a scroll container so wide tables never break the layout on phones.
export default function rehypeTableWrap() {
  const visit = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'table') {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-wrap'], tabIndex: 0, role: 'region', ariaLabel: 'Table' },
          children: [child],
        };
      }
      visit(child);
      return child;
    });
  };
  return (tree) => visit(tree);
}
