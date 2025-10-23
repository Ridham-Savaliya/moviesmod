import Link from 'next/link';
import Image from 'next/image';
import { FiEye, FiStar, FiClock } from 'react-icons/fi';
import { getImageUrl, formatViews, getQualityColor } from '@/lib/utils';

const MovieCard = ({ movie }) => {
  return (
    <Link href={`/movie/${movie.slug}`}>
      <div className="group cursor-pointer">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
          <Image
            src={getImageUrl(movie.poster)}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          
          {/* Quality Badge */}
          {movie.quality && (
            <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
              {movie.quality}
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              <FiEye className="mx-auto mb-2" size={24} />
              <p className="text-sm font-semibold">View Details</p>
            </div>
          </div>
        </div>
        
        {/* Movie Title */}
        <div className="mt-3">
          <h3 className="text-white font-medium text-sm leading-tight line-clamp-2 group-hover:text-green-400 transition-colors">
            {movie.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
