export default function Dimmed({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--mantine-color-dimmed)' }}>{children}</span>
}
