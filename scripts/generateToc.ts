import fs from "fs";
import path from "node:path";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import { Node } from "unist";
import { displayName } from "@/lib/text-parser";
import { tocList } from "@/routes";

// Set tipe node yang berisi teks
const textTypes = new Set(["text", "emphasis", "strong", "inlineCode"]);

// Fungsi untuk membersihkan dan menggabungkan teks dari heading
function flattenNode(node: Node): string {
  let text = "";
  visit(node, (child: any) => {
    if (textTypes.has(child.type)) {
      text += child.value;
    }
  });
  return text.trim();
}

// Fungsi untuk membuat slug dari heading
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\*\*|\*/g, "") // Hapus tanda `**bold**` atau `*italic*`
    .replace(/`/g, "") // Hapus backtick dalam `code`
    .replace(/[^\w\s-]/g, "") // Hapus karakter selain huruf, angka, spasi, dan tanda hubung
    .replace(/\s+/g, "-"); // Ganti spasi dengan tanda "-"
}

function cleanedName(title: string) {
  return displayName(title.replace("undefined", ""), "unformated");
}

// Fungsi untuk mengecualikan metadata di awal file MDX
function removeFrontMatter(content: string): string {
  if (content.startsWith("---")) {
    const endIndex = content.indexOf("\n---", 3);
    return endIndex !== -1 ? content.slice(endIndex + 4).trim() : content;
  }
  return content;
}

// Fungsi untuk mengekstrak heading dari file MDX
function extractHeadingsFromFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf-8");
  content = removeFrontMatter(content); // Hapus metadata

  const headings: { level: number; title: string }[] = [];

  const ast = remark().parse(content);

  visit(ast, "heading", (node: any) => {
    const title = flattenNode(node);
    // Hanya tambahkan heading yang memiliki teks yang valid
    if (title && title !== "undefined") {
      headings.push({ level: node.depth, title });
    }
  });

  return headings;
}

// Fungsi untuk membuat Table of Contents
// function generateTableOfContents(files: string[]): string {
//   let toc = `# Table of Contents\n\n---\n\n`;

//   files.forEach(file => {
//     const filePath = path.join("md", file);
//     const headings = extractHeadingsFromFile(filePath);
//     const fileLink = `/${file.replace(".mdx", "")}`;

//     let fileToc = "";

//     headings.forEach(heading => {
//       const slug = generateSlug(cleanedName(heading.title));
//       const link = `[${cleanedName(heading.title.trimEnd())}](${fileLink}#${slug})`;

//       if (heading.level === 1) {
//         fileToc += `- ${link}\n`;
//       } else {
//         const indentation = "  ".repeat(heading.level - 2);
//         fileToc += `  ${indentation}- ${link}\n`;
//       }
//     });

//     if (fileToc) {
//       toc += fileToc + "\n";
//     }
//   });

//   return toc;
// }

// Membuat Table of Contents berdasarkan daftar `tocList`
function generateTableOfContents(files: string[] = tocList) {
  let toc = `# Table of Contents\n\n---\n\n`;

  files.forEach(file => {
    const filePath = path.join("md", `${file}.mdx`);

    // Jika file tidak ada, skip
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}, skipping.`);
      return;
    }

    const headings = extractHeadingsFromFile(filePath);
    if (headings.length === 0) return;

    const fileLink = `/${file}`;
    let fileToc = "";

    headings.forEach(heading => {
      const slug = generateSlug(heading.title.replace("undefined", ""));
      const link = `[${cleanedName(heading.title.trimEnd())}](${fileLink}#${slug})`;

      if (heading.level === 1) {
        fileToc += `- [**${cleanedName(heading.title.trimEnd())}**](${fileLink}#${slug})\n`;
      } else {
        const indentation = "  ".repeat(heading.level - 2);
        fileToc += `  ${indentation}- ${link}\n`;
      }
    });

    if (fileToc) {
      toc += fileToc + "";
    }
  });

  console.log("Running Generated List:", files);

  return toc;
}

interface GenerateTocFileProps {
  title: string;
  date: Date | string | number;
}

// Menghasilkan file toc.mdx
function generateTocFile({ title, date }: GenerateTocFileProps) {
  try {
    const toc = generateTableOfContents();

    const tocFilePath = path.join("md", "toc.mdx");

    const yamlMetadata = `---\ntitle: ${title}\ndate: ${date}\n---`;
    const content = `${yamlMetadata}\n\n${toc.trim()}\n`;

    fs.writeFileSync(tocFilePath, content, "utf-8");

    console.info(`\n✅ ${title} has been generated at ${tocFilePath}\n`);
  } catch (error) {
    console.error("Error:", `\n${error}\n`);
  }
}

const date = new Intl.DateTimeFormat("en-CA").format(new Date());

generateTocFile({
  title: "Table of Contents",
  date
});
