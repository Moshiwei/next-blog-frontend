import fs from 'fs'
import path from 'path'

// static blog post metadata
type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

// Parse frontmatter from MDX file
function parseFrontmatter(fileContent: string) {
  // matadata is between two sets of '---'
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  // match[1] is the metadata block
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  // content is everything after the metadata block
  let content = fileContent.replace(frontmatterRegex, '').trim()
  // split metadata block into lines
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  // parse metadata key value pairs
  frontMatterLines.forEach((line) => {
    // split line into key and value
    let [key, ...valueArr] = line.split(': ')
    // join value array into a string
    let value = valueArr.join(': ').trim()
    // remove quotes from value
    value = value.replace(/^['"](.*)['"]$/, '$1')
    // add key value pair to metadata object
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

// Get all MDX files in a directory
function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

// Read MDX file and parse frontmatter
function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

// Get static blog posts
// TODO: Implement get dynamic blog posts
export function getBlogPosts() {
  const dir = path.join(process.cwd(), 'app', 'blog', 'posts')
  try {
    if (!fs.existsSync(dir)) {
      console.error('No blog posts found')
      return []
    }
    return getMDXData(dir)
  } catch (error) {
    console.error('Error reading blog posts', error)
    return []
  }
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
