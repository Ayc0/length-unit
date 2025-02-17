import { getCollection, type CollectionEntry } from "astro:content";

const getTime = (post: CollectionEntry<"docs">): number => {
  if (post.data.createdAt) {
    return post.data.createdAt.getTime();
  }

  return 0;
};

export const getPublishablePosts = async () => {
  const posts = await getCollection(
    "docs",
    (post) => post.data.createdAt && !post.data.draft && post.data.pagefind,
  );

  posts.forEach((post) => {
    if (post.slug.startsWith("posts/drafts/")) {
      throw new Error(`Public post ${post.id} cannot be in the drafts folder`);
    }
  });

  return posts.sort((postA, postB) => getTime(postB) - getTime(postA));
};

const sections = ["React", "Dark mode", "CSS", "TypeScript", "Yarn", "Others"];

export const getPublishablePostsBySection = async () => {
  const posts = await getPublishablePosts();
  // console.log(posts);
  const groups: Record<string, CollectionEntry<"docs">[]> = Object.fromEntries(
    sections.map((section) => [section, []]),
  );
  for (const post of posts) {
    const group = post.id.split("/")[1];
    if (!group) {
      throw new Error(`Post ${post.id} has no section`);
    }
    groups[group]!.push(post);
  }

  return groups;
};

export const getDraftPosts = async () => {
  const posts = await getCollection(
    "docs",
    (post) => post.data.draft || !post.data.pagefind,
  );

  posts.forEach((post) => {
    if (!post.slug.startsWith("posts/drafts/")) {
      throw new Error(`Draft post ${post.id} is not in the drafts folder`);
    }
  });

  return posts.sort((postA, postB) => getTime(postB) - getTime(postA));
};

export const getCreatedDate = (
  post: Pick<CollectionEntry<"docs">, "data">,
): string => {
  if (!post.data.createdAt) {
    return "";
  }

  let full = `Posted on ${post.data.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  if (post.data.lastUpdated instanceof Date) {
    if (
      post.data.createdAt.toLocaleDateString("en-US") !==
      post.data.lastUpdated.toLocaleDateString("en-US")
    ) {
      full += ` (Edited on ${post.data.lastUpdated.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })})`;
    }
  }

  return full;
};
