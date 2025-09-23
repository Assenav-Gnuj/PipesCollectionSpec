import { useMemo } from 'react';

interface TobaccoProfileChartProps {
  strength: number;
  taste: number;
  aroma: number;
  room_note: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabels?: boolean;
  showValues?: boolean;
}

export default function TobaccoProfileChart({
  strength,
  taste,
  aroma,
  room_note,
  size = 'md',
  className = '',
  showLabels = true,
  showValues = false
}: TobaccoProfileChartProps) {
  
  const chartData = useMemo(() => [
    { label: 'Força', value: strength, color: 'bg-red-500' },
    { label: 'Sabor', value: taste, color: 'bg-amber-500' },
    { label: 'Aroma', value: aroma, color: 'bg-green-500' },
    { label: 'Room Note', value: room_note, color: 'bg-blue-500' }
  ], [strength, taste, aroma, room_note]);

  const sizeClasses = {
    sm: {
      container: 'w-32 h-32',
      center: 'w-16 h-16',
      text: 'text-xs',
      valueText: 'text-xs'
    },
    md: {
      container: 'w-40 h-40',
      center: 'w-20 h-20',
      text: 'text-sm',
      valueText: 'text-sm'
    },
    lg: {
      container: 'w-48 h-48',
      center: 'w-24 h-24',
      text: 'text-base',
      valueText: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  // Calculate polar coordinates for each value
  const getCoordinates = (index: number, value: number, radius: number) => {
    const angle = (index * Math.PI * 2) / 4 - Math.PI / 2; // Start from top
    const normalizedValue = Math.max(0, Math.min(5, value)) / 5; // Normalize to 0-1
    const distance = radius * normalizedValue;
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  };

  const radius = size === 'sm' ? 50 : size === 'md' ? 65 : 80;
  const centerX = radius + 20;
  const centerY = radius + 20;

  // Create path for the filled area
  const createPath = () => {
    const points = chartData.map((item, index) => {
      const coords = getCoordinates(index, item.value, radius);
      return `${centerX + coords.x},${centerY + coords.y}`;
    });
    
    return `M ${points.join(' L ')} Z`;
  };

  // Create grid circles
  const gridCircles = [1, 2, 3, 4, 5].map(level => (
    <circle
      key={level}
      cx={centerX}
      cy={centerY}
      r={(radius * level) / 5}
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="1"
    />
  ));

  // Create grid lines
  const gridLines = chartData.map((_, index) => {
    const coords = getCoordinates(index, 5, radius);
    return (
      <line
        key={index}
        x1={centerX}
        y1={centerY}
        x2={centerX + coords.x}
        y2={centerY + coords.y}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  });

  // Create labels
  const labels = chartData.map((item, index) => {
    const coords = getCoordinates(index, 5, radius + 15);
    return (
      <text
        key={index}
        x={centerX + coords.x}
        y={centerY + coords.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className={`${currentSize.text} font-medium text-gray-700 fill-current`}
      >
        {showLabels ? item.label : ''}
      </text>
    );
  });

  // Create value points
  const valuePoints = chartData.map((item, index) => {
    const coords = getCoordinates(index, item.value, radius);
    return (
      <g key={index}>
        <circle
          cx={centerX + coords.x}
          cy={centerY + coords.y}
          r="4"
          className="fill-current text-amber-600"
          stroke="white"
          strokeWidth="2"
        />
        {showValues && (
          <text
            x={centerX + coords.x}
            y={centerY + coords.y - 12}
            textAnchor="middle"
            className={`${currentSize.valueText} font-bold text-amber-600 fill-current`}
          >
            {item.value.toFixed(1)}
          </text>
        )}
      </g>
    );
  });

  const svgSize = (radius + 40) * 2;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Chart */}
      <div className="relative">
        <svg
          width={svgSize}
          height={svgSize}
          className="overflow-visible"
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {/* Grid */}
          {gridCircles}
          {gridLines}
          
          {/* Filled area */}
          <path
            d={createPath()}
            fill="rgba(245, 158, 11, 0.2)"
            stroke="rgb(245, 158, 11)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          
          {/* Value points */}
          {valuePoints}
          
          {/* Labels */}
          {labels}
        </svg>
      </div>

      {/* Legend */}
      {showLabels && (
        <div className="grid grid-cols-2 gap-2 text-center">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className={`${currentSize.text} text-gray-700`}>
                {item.label}
                {showValues && (
                  <span className="font-semibold ml-1">
                    ({item.value.toFixed(1)})
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="text-center">
        <div className={`${currentSize.text} text-gray-600`}>
          Perfil do Tabaco
        </div>
        <div className={`${currentSize.valueText} font-semibold text-gray-800`}>
          Média: {((strength + taste + aroma + room_note) / 4).toFixed(1)}/5
        </div>
      </div>
    </div>
  );
}

// Alternative bar chart version for simpler display
export function TobaccoProfileBars({
  strength,
  taste,
  aroma,
  room_note,
  size = 'md',
  className = '',
  showValues = true
}: TobaccoProfileChartProps) {
  
  const chartData = [
    { label: 'Força', value: strength, color: 'bg-red-500' },
    { label: 'Sabor', value: taste, color: 'bg-amber-500' },
    { label: 'Aroma', value: aroma, color: 'bg-green-500' },
    { label: 'Room Note', value: room_note, color: 'bg-blue-500' }
  ];

  const sizeClasses = {
    sm: { height: 'h-2', text: 'text-xs', spacing: 'space-y-2' },
    md: { height: 'h-3', text: 'text-sm', spacing: 'space-y-3' },
    lg: { height: 'h-4', text: 'text-base', spacing: 'space-y-4' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${currentSize.spacing} ${className}`}>
      {chartData.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className={`${currentSize.text} font-medium text-gray-700`}>
              {item.label}
            </span>
            {showValues && (
              <span className={`${currentSize.text} font-semibold text-gray-600`}>
                {item.value.toFixed(1)}/5
              </span>
            )}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`${currentSize.height} ${item.color} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${(Math.max(0, Math.min(5, item.value)) / 5) * 100}%` }}
            />
          </div>
        </div>
      ))}
      
      <div className="pt-2 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className={`${currentSize.text} font-medium text-gray-700`}>
            Média Geral
          </span>
          <span className={`${currentSize.text} font-bold text-amber-600`}>
            {((strength + taste + aroma + room_note) / 4).toFixed(1)}/5
          </span>
        </div>
      </div>
    </div>
  );
}