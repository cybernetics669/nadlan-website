import { FC } from 'react';

interface PropertyMapProps {
  address: string;
}

export const PropertyMap: FC<PropertyMapProps> = ({ address }) => {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 group">
      <iframe
        width="100%"
        height="100%"
        src={mapSrc}
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
        title="Property Location Map"
      />
      
      {/* Overlay controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-white/90 backdrop-blur-sm text-sm font-medium text-slate-700 rounded-lg shadow-sm border border-slate-200 hover:bg-white hover:text-primary-600 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          </svg>
          Open in Maps
        </a>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-slate-200 max-w-[80%]">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Location</div>
        <div className="text-sm font-medium text-slate-900 truncate">{address}</div>
      </div>
    </div>
  );
};
