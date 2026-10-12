import { useOutletContext } from 'react-router-dom'
import type { SiteData } from '../hooks/useSiteData'

export function useLayoutData(): SiteData {
  return useOutletContext<SiteData>()
}
