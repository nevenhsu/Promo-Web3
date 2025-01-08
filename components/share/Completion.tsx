import { Box, Button, Divider, Stack, Title } from '@mantine/core'

export enum Status {
  Init = 'init',
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

type Text = {
  // button text
  okay?: string
  back?: string
  // status text
  init?: string
  pending?: string
  success?: string
  failed?: string
}

type CompletionProps = {
  header: React.ReactNode
  description?: React.ReactNode
  status: Status
  text?: Text
  onOk: () => void
  onBack: () => void
}

export default function Completion(props: CompletionProps) {
  const { header, description, status, text, onOk, onBack } = props

  const pending = status === Status.Pending
  const finished = status === Status.Success || status === Status.Failed

  return (
    <>
      <Stack gap="lg" py="md">
        {header && (
          <>
            {header}

            <Divider />
          </>
        )}

        <Stack gap="sm" align="center">
          <Title order={3}>
            {status === Status.Success
              ? text?.success || 'Success!'
              : status === Status.Failed
                ? text?.failed || 'Failed!'
                : status === Status.Pending
                  ? text?.pending || 'Pending...'
                  : text?.init || ''}
          </Title>

          {description && <Box ta="center">{description}</Box>}
        </Stack>

        <Stack>
          <Button onClick={onOk} loading={pending}>
            {text?.okay || 'Okay, done'}
          </Button>

          {finished && (
            <Button onClick={onBack} variant="outline">
              {text?.back || 'Back'}
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  )
}
