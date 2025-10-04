interface StatsCardProps {
  label: string
  value: string
  color: string
}

export const StatsCard = ({ label, value, color }: StatsCardProps) => {
  return (
    <div 
      className="border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      style={{ backgroundColor: color }}
    >
      <p className="font-bold mb-2 text-lg">{label}</p>
      <p className="text-4xl font-black">{value}</p>
    </div>
  )
}
