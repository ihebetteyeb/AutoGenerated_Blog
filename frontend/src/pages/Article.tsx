import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { Article } from "../types";
import { Typography, Container } from "@mui/material";

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    client
      .get<Article>(`/articles/${id}`)
      .then((res) => setArticle(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <Container className="p-6 max-w-4xl mx-auto">
      <Typography variant="h3" className="mb-4">
        {article.title}
      </Typography>
      <Typography variant="body1">{article.content}</Typography>
    </Container>
  );
};

export default ArticlePage;
