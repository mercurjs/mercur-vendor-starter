import React from 'react'
import { useAdminUser } from 'medusa-react'

import { OrderEditEvent } from '../../../../hooks/use-build-timeline'
import XCircleIcon from '../../../fundamentals/icons/x-circle-icon'
import EventContainer from '../event-container'

import { ByLine } from '.'

type EditCanceledProps = {
  event: OrderEditEvent
}

const EditCanceled: React.FC<EditCanceledProps> = ({ event }) => {
  const { user } = useAdminUser(event.edit.canceled_by as string)

  return (
    <EventContainer
      title={'Order Edit canceled'}
      icon={<XCircleIcon size={20} />}
      time={event.time}
      isFirst={event.first}
      midNode={<ByLine user={user} />}
    />
  )
}

export default EditCanceled
