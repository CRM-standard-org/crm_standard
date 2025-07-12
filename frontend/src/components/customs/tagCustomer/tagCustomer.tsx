import React from 'react';

interface TagProp {
  nameTag: string;
  color: string;
}

const TagCustomer: React.FC<TagProp> = ({ nameTag, color }) => {
  return (
    <div
      className="text-xs px-2 py-1 rounded-full inline-block"
      style={{ backgroundColor: color }}
    >
      <h2 className="text-white">{nameTag}</h2>
    </div>
  );
};

export default TagCustomer;
