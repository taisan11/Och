export function MES(input: string|null): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      '\n': '<br/>'
    };
    if (input == null){return '';}
    return input.replace(/[&<>"'\n]/g, function(m) { return map[m]; });
  }