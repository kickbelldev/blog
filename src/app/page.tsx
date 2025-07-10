import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      Hello World
      <Link href="/mdx-test">MdxTest</Link>
    </div>
  )
}
