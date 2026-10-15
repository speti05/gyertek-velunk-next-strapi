import Image from "next/image";

interface EmptyContentProps {
  title: string;
  description: string;
}

export function EmptyContent({ title, description }: Readonly<EmptyContentProps>) {
  return (
    <div className="empty-content">
      <div className="empty-content__frame">
        <Image
          className="empty-content__image"
          src="/not-found-graphic.png"
          alt=""
          fill
          sizes="(min-width: 768px) 36rem, 100vw"
        />
        {/* The title sits over the open sky in the upper part of the graphic */}
        <h3 className="empty-content__title">{title}</h3>
      </div>
      <p className="empty-content__description">{description}</p>
    </div>
  );
}
