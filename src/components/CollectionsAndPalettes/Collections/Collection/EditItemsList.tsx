import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React from "react";
import classNames from "classnames";
import ItemCard from "../../common/ItemCard/ItemCard";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

interface Props {
  card: [
    {
      id: number;
      type: string;
      title1: string;
      title2: string;
      price?: any;
      imagePath: string;
    }
  ];
}

export default class EditItemsList extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.card,
    };
  }

  onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    this.setState({
      items,
    });
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={classNames(
                "list",
                snapshot.isDraggingOver && "draggingOver"
              )}
              {...provided.droppableProps}
            >
              {this.state.items.map((card, index) => (
                <Draggable
                  key={card.id}
                  draggableId={`${card.id}-id`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className={classNames(
                        "item",
                        snapshot.isDragging && "dragging"
                      )}
                      style={provided.draggableProps.style}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ItemCard mode={"edit"} item={card} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
