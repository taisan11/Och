export function MES(input: string|null): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '\n': '\n<br/>\n' // Replace '\n' with '\n<br/>\n'
  };
  if (input == null){return '';}
  const convertedInput = input.replace(/[&<>"'\n]/g, function(m) { return map[m]; });
  return convertedInput.replace(/>>\d+/g, function(m) {
    const num = m.substring(2);
    return `<a href="#${num}">&gt;&gt;${num}</a>`;
  });
}
