import { Button, Stack, Title } from '@mantine/core'

export enum Status {
  Init = 'init',
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

type Text = {
  // button text
  okay?: string
  // status text
  init?: string
  pending?: string
  success?: string
  failed?: string
}

type CompletionProps = {
  header: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  status: Status
  text?: Text
  onOk: () => void
}

export default function Completion(props: CompletionProps) {
  const { header, description, action, status, text, onOk } = props

  const init = status === Status.Init
  const pending = status === Status.Pending

  return (
    <>
      <Stack gap="lg" w="100%">
        {header && <>{header}</>}

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

          {description && <>{description}</>}
        </Stack>

        <Stack>
          {!init && (
            <Button onClick={onOk} loading={pending}>
              {text?.okay || 'Okay, done'}
            </Button>
          )}

          {action && <>{action}</>}
        </Stack>
      </Stack>
    </>
  )
}
