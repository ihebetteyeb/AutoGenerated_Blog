import React from "react";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import { Article } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  article: Article;
}

const ArticleCard: React.FC<Props> = ({ article }) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-4">
      <CardActionArea onClick={() => navigate(`/article/${article.id}`)}>
        <CardContent>
          <Typography variant="h5">{article.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {article.summary}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;
