import Head from "next/head";
import { TableOfContents } from "../components/TableOfContents";
import Meta from "../components/Meta";
import Link from "next/link";
import { useState } from "react";
import classnames from "classnames";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SingleColumn from "../components/SingleColumn";
import Section from "../components/Section";
import PostPreview from "../components/PostPreview";
import GrantPreview from "../components/GrantPreview";
import {
  getAllPosts,
  getGrantsCategories,
  getGrantsTypes,
  getPostBySlug,
} from "../lib/lib";

function addTag(array, tag) {
  return [...array, tag];
}

function removeTag(array, tag) {
  const location = array.indexOf(tag);
  if (location === -1) {
    return array;
  }
  const newArr = [...array];
  newArr.splice(location, 1);
  return newArr;
}

function setAllActive(fullSet) {
  return fullSet;
}

function setAllInactive() {
  return [];
}

function setOneTagOnly(tag) {
  return [tag];
}

function toggleTag(array, tag) {
  if (array.includes(tag)) {
    return removeTag(array, tag);
  } else {
    return addTag(array, tag);
  }
}

function toggleAll(currentArray, fullSet) {
  if (currentArray.length === 0) {
    return setAllActive(fullSet);
  } else {
    return setAllInactive();
  }
}

export default function Grants({
  posts,
  categories,
  types,
  featuredGrants,
  search,
  giftPosts,
  gifts,
}) {
  const [activeTags, setTags] = useState([]);
  const [activeTypes, setTypes] = useState(types);
  const [includeCompleted, setIncludeCompleted] = useState(false);
  const [tab, setTab] = useState(0);
  const post = {
    title: "Grants",
    description: "Contribute to the Urbit project while earning address space.",
  };

  const postsByCompletion = posts.filter((post) => {
    return includeCompleted
      ? true
      : !post.extra.completed && post.extra.assignee === "";
  });

  const filteredPosts = postsByCompletion.filter((post) => {
    // Posts are returned if they match both the selected category and selected tags, or if the user has no category filters set.
    const hasCategory = post.taxonomies.grant_category.some((category) =>
      activeTags.includes(category)
    );
    const noTagsSelected = activeTags.length === 0;
    const hasType = post.taxonomies.grant_type.some((type) =>
      activeTypes.includes(type)
    );

    return (hasCategory || noTagsSelected) && hasType;
  });

  const allCount = postsByCompletion.length;

  const counts = {
    Bounty: postsByCompletion.filter((post) =>
      post.taxonomies.grant_type.includes("Bounty")
    ).length,
    Apprenticeship: postsByCompletion.filter((post) =>
      post.taxonomies.grant_type.includes("Apprenticeship")
    ).length,
    Proposal: postsByCompletion.filter((post) =>
      post.taxonomies.grant_type.includes("Proposal")
    ).length,
  };

  return (
    <Container>
      <Head>
        <title>Grants • urbit.org</title>
        {Meta(post)}
      </Head>
      <SingleColumn>
        <Header search={search} />
        {
          // Heading and introduction
        }
        <Section wide>
          <div className="flex flex-column justify-between pb-16">
            <div>
              <h1 className="pb-16">Grants</h1>
              <p className="mb-8">
                Urbit is a community project. While anyone can contribute, we
                help focus development and reward exceptional contribution
                through our grants program.
              </p>
              <p>
                Contributors of all types have access to a wide variety of
                resources while working on projects, including a supportive team
                at urbit.org, Tlon developers, and community mentors.
              </p>
            </div>
            <TableOfContents staticPosition />
          </div>
          <div className="p-8 bg-wall flex flex-col w-full rounded-lg space-y-4">
            <p>
              <i>
                “I paid off my student loans through the Urbit grants program,
                and had fun doing it!”
              </i>
            </p>
            <p>
              — Urbit Community Member{" "}
              <pre className="ml-6">~radbur-sivmus</pre>
            </p>
          </div>
        </Section>
        {
          // Featured Grants
        }
        <Section wide>
          <div className="measure pb-16">
            <h2 className="pb-16" id="featured">
              Featured Grants
            </h2>
            <p className="mb-8">
              These grants should give you a general idea of what kind of work
              we reward:
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4 space-x-0">
            {featuredGrants.map((grant) => {
              return (
                <Link href={"/grants/" + grant.slug}>
                  <div className="p-8 bg-washedGreen rounded-lg w-full md:w-1/3 cursor-pointer">
                    <h4 className="pb-4">{grant.title}</h4>
                    <p className="text-green pb-4">
                      {grant.extra.reward} star
                      {grant.extra.reward === 1 ? "" : "s"}{" "}
                      {grant.extra.completed ? "awarded" : "pending"}
                    </p>
                    <p>{grant.extra.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
        {
          // Find a Grant
        }
        <Section wide>
          <h2 id="find-a-grant" className="pb-8">
            Find A Grant
          </h2>
          <h5 className="text-black font-semibold my-2">Work Programs</h5>
          <div className="flex flex-wrap items-center pb-2">
            <button
              onClick={() => {
                setTab(0);
                setTypes(types);
              }}
              className={`badge-lg my-2 mr-2 ${
                tab === 0 ? "text-white bg-black" : "text-gray bg-wall"
              }`}
            >
              All <div className="opacity-50 ml-2">{allCount}</div>
            </button>
            {types.map((type, index) => {
              const className = classnames({
                "bg-blue text-white": tab === index + 1 && type === "Proposal",
                "bg-green text-white":
                  tab === index + 1 && type === "Apprenticeship",
                "bg-yellow": tab === index + 1 && type === "Bounty",
                "bg-wall text-gray": tab !== index + 1,
              });
              return (
                <button
                  onClick={() => {
                    // + 1 is added here because the 'all' button precedes this sequence
                    setTab(index + 1);
                    setTypes([type]);
                  }}
                  className={`badge-lg mr-2 ${className}`}
                >
                  {type} <div className="opacity-50 ml-2">{counts[type]}</div>
                </button>
              );
            })}
          </div>
          <h5 className="text-black font-semibold my-2">Work Categories</h5>
          <div className="flex flex-wrap mb-12">
            {categories.map((category) => {
              const isActive = activeTags.includes(category);
              const activeClasses = classnames({
                "bg-green text-white": isActive,
                "bg-wall text-gray": !isActive,
              });
              return (
                <button
                  onClick={() => setTags(toggleTag(activeTags, category))}
                  className={`${activeClasses} badge-sm mr-1 my-1`}
                >
                  {category}
                </button>
              );
            })}
          </div>
          {
            <div className="pb-8 flex items-center">
              <button
                className="mr-4 badge-sm bg-black text-white"
                onClick={() => setIncludeCompleted(!includeCompleted)}
              >
                {includeCompleted ? "Exclude Completed" : "Include Completed"}
              </button>

              <h4>
                Showing {filteredPosts.length} grant
                {filteredPosts.length === 1 ? "" : "s"}
              </h4>
            </div>
          }
          {filteredPosts.map((post) => {
            return <GrantPreview grant={post} />;
          })}
        </Section>
        {/* Submit a proposal */}
        <Section wide>
          <h2 className="mb-16" id="proposals">
            Proposals
          </h2>
          <p className="mb-8">
            Contributors are also welcome to have their personal projects
            considered as a proposal. If you'd like to propose a project for the
            grants program, first review our
            <a href="/grant-submission-guide">submission guide</a>, and feel
            free to{" "}
            <a href="https://airtable.com/shrCi54rEDxgSZr3z">
              submit your proposal
            </a>
            .
          </p>
        </Section>
        {
          // Gift Grants
        }
        <Section wide>
          <div className="pb-16">
            <h2 className="pb-16" id="gifts">
              Gifts
            </h2>
            <p className="mb-8">
              Gifts are given post-facto for exceptional contributions.
            </p>
            {/* Uncomment once people added to content/gifts folder. */}
            {/* {gifts.map((e) => {
              return (
                <div className="bg-wall rounded-xl p-4 my-8 flex justify-between">
                <p className="font-semibold">
                  {e.name}
                </p>
                <p>{e.planet}</p>
                <p>{e.date}</p>
                <a className="type-p" href={e.link}>Link</a>
                </div>
              )
            })} */}
            <div className="flex flex-wrap">
              <PostPreview
                post={giftPosts[0]}
                className={`w-full md:w-1/2 pr-0 pb-8 md:pr-4`}
                key={giftPosts[0].slug}
                section={giftPosts[0].section}
              />
              <PostPreview
                post={giftPosts[1]}
                className={`w-full md:w-1/2 pl-0 pb-8 md:pl-4`}
                key={giftPosts[1].slug}
                section={giftPosts[1].section}
              />
            </div>
          </div>
        </Section>
      </SingleColumn>
      <Footer />
    </Container>
  );
}

export async function getStaticProps() {
  const categories = getGrantsCategories();
  const types = getGrantsTypes();
  const posts = getAllPosts(
    ["title", "slug", "date", "description", "extra", "taxonomies"],
    "grants"
  );
  // all the gift posts stuff can be removed once we migrate to gifts
  let giftPosts = getAllPosts(
    ["title", "slug", "date", "description", "extra", "taxonomies"],
    "blog"
  );
  giftPosts.map((e) => (e.section = "blog"));
  let updates = getAllPosts(
    ["title", "slug", "date", "description", "extra", "taxonomies"],
    "updates"
  );
  updates.map((e) => (e.section = "updates"));
  giftPosts.push(...updates);
  giftPosts = giftPosts
    .filter((e) => e?.taxonomies?.grant_type?.includes("Gift"))
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const gifts = getAllPosts(["name", "planet", "date", "link"], "gifts");

  // The layout expects exactly 3
  const featuredGrants = [
    "bitcoin-full-node-provider-and-wallet",
    "webrtc-gall-agent-and-external-app",
    "urbian-a-customized-linux-distribution-for-urbit-appliances",
  ].map((slug) =>
    getPostBySlug(slug, ["title", "slug", "date", "extra"], "grants")
  );

  return {
    props: {
      posts: posts,
      categories,
      types,
      featuredGrants,
      giftPosts,
      gifts,
    },
  };
}