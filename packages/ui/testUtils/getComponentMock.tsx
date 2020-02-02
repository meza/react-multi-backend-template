import React from 'react';

export default function getMockComponent(name: string): React.FC {
  return (props: any) => <div {...props}>{`Mock ${name}`}{props.children}</div>;
}
