interface DeploymentPictureProps {
  image_url?: string;
}

function DeploymentPicture({ image_url }: DeploymentPictureProps) {
  if (!image_url) {
    return <p className="text-sm text-muted-foreground">This deployment has no picture</p>;
  }

  return (
    <img src={image_url} alt="Deployment" className="max-h-64 max-w-lg rounded-md object-contain" />
  );
}

export { DeploymentPicture };
