import { Typography, Card, CardContent, Divider } from "@mui/material";

function Feeds() {
  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>
        Company Feeds
      </Typography>

      {[1, 2, 3].map((feed) => (
        <Card key={feed} className="mb-4">
          <CardContent>
            <Typography variant="h6">Feed Title {feed}</Typography>
            <Typography variant="body2" className="text-gray-600">
              This is a sample feed message for events, announcements, or HR
              updates.
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Feeds;
