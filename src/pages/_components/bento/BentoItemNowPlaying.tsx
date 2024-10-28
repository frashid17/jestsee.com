import { Spotify } from '@icons/Spotify'
import { useRef } from 'react'
import useSWR from 'swr'

import client from '@/lib/client'
import { cn, fetcher } from '@/lib/utils'
import type { SpotifyData } from '@/pages/api/_spotify'

import BentoBadge from './BentoBadge'

const BentoItemNowPlaying = () => {
  const previousDataRef = useRef<SpotifyData>()

  const { data: _data, error } = useSWR(
    'spotify',
    fetcher(() => client.api.spotify.$get()),
    {
      refreshInterval: 10000,
      onSuccess(data) {
        previousDataRef.current = data
      }
    }
  )

  // TODO: handle initial error
  if (error && !previousDataRef.current) return <p>masok error</p>

  const data = _data || previousDataRef.current

  return (
    <a
      href={data?.songUrl}
      target='_blank'
      className={cn(
        'group relative flex h-full items-center gap-x-6 p-5',
        'max-lg:p-6 md:max-lg:flex-col md:max-lg:items-start md:max-lg:justify-between'
      )}
    >
      <BentoBadge
        icon={Spotify}
        className={{
          component: 'absolute right-3 top-3',
          icon: 'transition-all duration-300 group-hover:text-green-400'
        }}
      />
      <div className='aspect-square h-full rounded-xl bg-black p-3 max-lg:h-3/5 max-md:min-w-24'>
        <div className='relative'>
          <img
            src={data?.albumImageUrl}
            alt='Last Played Song'
            className={cn('absolute rounded-full', {
              'animate-[spin_5s_linear_infinite]': data?.isPlaying
            })}
          />
        </div>
      </div>
      <div className='w-full space-y-1 overflow-hidden tracking-wider'>
        <p className='text-sm tracking-wide text-slate-400'>
          {data?.isPlaying ? 'Now playing' : 'Last played'}
        </p>
        <div className='items-center gap-x-4 space-y-1 md:max-lg:flex'>
          <p className='max-w-full flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium'>
            {data?.title}
          </p>
          <p className='overflow-hidden text-ellipsis whitespace-nowrap text-sm uppercase text-slate-400'>
            {data?.artist}
          </p>
        </div>
      </div>
    </a>
  )
}

export default BentoItemNowPlaying