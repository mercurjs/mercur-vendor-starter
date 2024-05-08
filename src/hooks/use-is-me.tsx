import { useMemo } from 'react'
import { useAdminGetSession } from 'medusa-react'

export const useIsMe = (userId: string | undefined) => {
  const { user } = useAdminGetSession()

  const isMe = useMemo(() => {
    return user?.id === userId
  }, [user, userId])

  return isMe
}
