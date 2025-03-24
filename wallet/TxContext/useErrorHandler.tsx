'use client'

import * as _ from 'lodash-es'
import { Link } from '@/i18n/routing'
import { BaseError } from 'viem'
import { modals } from '@mantine/modals'
import { Box, Text } from '@mantine/core'

export function useErrorHandler() {
  const handleError = (error: unknown) => {
    if (error instanceof BaseError) {
      console.log('Viem Error', {
        name: error.name,
        details: error.details,
        shortMessage: error.shortMessage,
        message: error.message,
      })

      const reverted = _.includes(error.details, 'reverted')

      if (reverted) {
        modals.openConfirmModal({
          title: 'Execution reverted',
          children: (
            <Box pb="xl">
              <Text fz="sm">{error.shortMessage}</Text>
              <Text fz="sm">Please try again later.</Text>
            </Box>
          ),
          labels: { confirm: 'Okay', cancel: 'Close' },
          onCancel: () => console.log('Close'),
          onConfirm: () => console.log('Confirmed'),
        })
      }
    }
  }

  const handleFundError = (error: unknown) => {
    if (error instanceof BaseError) {
      const insufficient = _.includes(error.details, 'insufficient funds')

      if (insufficient) {
        modals.closeAll()
        modals.openConfirmModal({
          title: 'Insufficient funds',
          children: (
            <Box pb="xl">
              <Text fz="sm">Please deposit ETH to your selected wallet.</Text>
              <Text fz="sm">You don't have enough funds to complete this transaction.</Text>
            </Box>
          ),
          labels: { confirm: <Link href="/wallet/receive">Deposit ETH</Link>, cancel: 'Close' },
          onCancel: () => console.log('Close'),
          onConfirm: () => console.log('Confirmed'),
        })
      }
    }
  }

  return { handleError, handleFundError }
}
