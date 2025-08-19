import React, { useRef, useState, useCallback, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Image as ImageType, Position, Size } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from './ui/card';
import { X } from 'lucide-react';

interface ImageProps {
  image: ImageType;
  onMove: (id: string, position: Position) => void;
  onDelete: (id: string) => void;
  onResizeStop: (id: string, size: Size) => void;
}

function Image({ image, onMove, onDelete, onResizeStop }: ImageProps): React.ReactElement {
  const imageRef = useRef<HTMLDivElement>(null);
  const resizableDivRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [localPosition, setLocalPosition] = useState<Position>({
    x: image.x,
    y: image.y,
  });

  useEffect(() => {
    const element = resizableDivRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;

        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
          const newHeight = element.offsetHeight;
          if (Math.round(width) !== image.width || Math.round(newHeight) !== image.height) {
            onResizeStop(image.id, { width: Math.round(width), height: Math.round(newHeight) });
          }
        }, 500);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [image.id, image.width, image.height, onResizeStop]);

  const handleDrag = useCallback((_e: DraggableEvent, data: DraggableData) => {
    setLocalPosition({ x: data.x, y: data.y });
  }, []);

  const handleStop = useCallback(() => {
    onMove(image.id, localPosition);
  }, [onMove, image.id, localPosition]);

  return (
    <Draggable
      nodeRef={imageRef}
      enableUserSelectHack={true}
      position={{ x: image.x, y: image.y }}
      onDrag={handleDrag}
      onStop={handleStop}
      cancel='.cancel'
    >
      <Card ref={imageRef} className='w-fit'>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="truncate">{image.name}</CardTitle>
          <CardAction>
            <Button
              variant="destructive"
              size="icon"
              className="h-9 w-9 group-hover:opacity-70 transition-opacity"
              onClick={() => onDelete(image.id)} >
              <X className="h-4 w-4" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div
            ref={resizableDivRef}
            className='cancel overflow-hidden resize-x min-w-[200px] min-h-[150px]'
            style={{ width: image.width }}
          >
            <img src={image.url} className="w-full h-full object-cover rounded-md" />
          </div>
        </CardContent>
      </Card>
    </Draggable>
  );
}

export default Image;