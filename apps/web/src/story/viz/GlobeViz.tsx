import type { Role } from '@noahclark/schema'
import { Globe } from '../../components/Globe'

export function GlobeViz({ role }: { role: Role; active: boolean }) {
  return <Globe target={role.location ? { lat: role.location.lat, lng: role.location.lng } : null} />
}
