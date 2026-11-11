import { FixedSizeList as List } from "react-window";
import PropertyCard from "./PropertyCard.jsx";

export default function VirtualizedList({ data }) {
  const Row = ({ index, style }) => (
    <div style={style} className="p-2">
      <PropertyCard item={data[index]} />
    </div>
  );

  return (
    <List
      height={600}
      width="100%"
      itemCount={data.length}
      itemSize={300}
    >
      {Row}
    </List>
  );
}
