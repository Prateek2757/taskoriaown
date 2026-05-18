import parse, {
  domToReact,
  HTMLReactParserOptions,
  DOMNode,
  Element,
} from "html-react-parser";

export function renderContent(html: string) {
  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (domNode.type !== "tag") return;

      const element = domNode as Element;

      const children = domToReact(element.children as DOMNode[], options);

      if (element.name === "p") {
        const text = element.children
          .map((c: any) => c.data ?? "")
          .join("")
          .replace(/\u00a0/g, "")
          .trim();

        if (!text) return <></>;

        return (
          <p className="text-[#0f1f5c] dark:text-zinc-200 text-base leading-relaxed mb-4">
            {children}
          </p>
        );
      }

      if (element.name === "h1") {
        return (
          <h1 className="text-[#0f1f5c] dark:text-white text-4xl font-bold mb-4 mt-10">
            {children}
          </h1>
        );
      }

      if (element.name === "h2") {
        return (
          <h2 className="text-[#0f1f5c] dark:text-white text-3xl font-bold mb-4 mt-10">
            {children}
          </h2>
        );
      }

      if (element.name === "h3") {
        return (
          <h3 className="text-[#0f1f5c] dark:text-zinc-100 text-2xl font-bold mb-3 mt-8">
            {children}
          </h3>
        );
      }

      if (element.name === "h4") {
        return (
          <h4 className="text-[#0f1f5c] dark:text-zinc-200 text-xl font-semibold mb-2 mt-6">
            {children}
          </h4>
        );
      }
      

      if (element.name === "ul") {
        return (
          <ul className="mb-4 mt-2 ml-5 space-y-3 list-disc">
            {children}
          </ul>
        );
      }

      if (element.name === "ol") {
        return (
          <ol className="mb-4 mt-2 ml-5 space-y-3 list-decimal">
            {children}
          </ol>
        );
      }

      if (element.name === "li") {
        return (
          <li className="text-[#0f1f5c] dark:text-zinc-200 text-base leading-relaxed">
            {children}
          </li>
        );
      }

      if (element.name === "strong") {
        return (
          <strong className="font-bold text-[#0f1f5c] dark:text-white">
            {children}
          </strong>
        );
      }

      if (element.name === "em") {
        return (
          <em className="italic text-[#0f1f5c] dark:text-zinc-200">
            {children}
          </em>
        );
      }

      if (element.name === "span") {
        return (
          <span className="text-[#0f1f5c] dark:text-zinc-200">
            {children}
          </span>
        );
      }

      if (element.name === "a") {
        const href = element.attribs?.href ?? "#";

        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 dark:text-blue-400 underline underline-offset-2 hover:text-blue-900">
            {children}
          </a>
        );
      }

      if (element.name === "blockquote") {
        return (
          <blockquote className="border-l-4 border-[#0f1f5c] dark:border-zinc-400 pl-4 my-6 text-[#0f1f5c] dark:text-zinc-300 italic">
            {children}
          </blockquote>
        );
      }
    },
  };

  return parse(html, options);
}