import BlockiesSvg from "blockies-react-svg";

export default function Header({ children, peerAddress }) {
  return (
    <div className="flex items-center space-x-2 text-xs bold bg-gray-800 p-2 shadow rounded-3xl">
      <BlockiesSvg
        address={peerAddress}
        size={8}
        scale={10}
        caseSensitive={false}
        className="h-6 w-6 rounded-full"
      />
      {children}
    </div>
  );
}
