"use client";

import { useState } from "react";
import type { AdminArticleRecord, AdminCommentRecord } from "@/types";
import { ArticleCreatePanel, ArticleManager } from "./ArticleManager";
import { CommentModerationPanel } from "./CommentModerationPanel";
import { adminGhostButtonClass, adminPrimaryButtonClass } from "./adminStyles";

interface TeachingsAdminTabsProps {
  articles: AdminArticleRecord[];
  comments: AdminCommentRecord[];
}

export function TeachingsAdminTabs({ articles, comments }: TeachingsAdminTabsProps) {
  const [tab, setTab] = useState<"articles" | "comments">("articles");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={tab === "articles" ? adminPrimaryButtonClass : adminGhostButtonClass}
          onClick={() => setTab("articles")}
        >
          Enseignements
        </button>
        <button
          type="button"
          className={tab === "comments" ? adminPrimaryButtonClass : adminGhostButtonClass}
          onClick={() => setTab("comments")}
        >
          Commentaires
          {comments.length > 0 ? (
            <span className="ml-2 font-sans text-xs font-normal opacity-80">
              {comments.length}
            </span>
          ) : null}
        </button>
      </div>

      {tab === "articles" ? (
        <>
          <div className="mt-8">
            <ArticleCreatePanel />
          </div>
          <div className="mt-10">
            <ArticleManager articles={articles} />
          </div>
        </>
      ) : (
        <div className="mt-8">
          <CommentModerationPanel comments={comments} />
        </div>
      )}
    </div>
  );
}
