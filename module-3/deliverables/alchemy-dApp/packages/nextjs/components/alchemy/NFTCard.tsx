import React from 'react';

const NFTCard = ({ title, description, image, quantity, buttons }) => {
    return (
        <div className="card w-80 bg-base-100 shadow-xl overflow-hidden">
            {/* Image section with quantity badge */}
            <figure className="relative h-56">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <span className="badge badge-neutral absolute top-2 right-2">{quantity}</span>
            </figure>

            {/* Content section */}
            <div className="card-body p-4 h-[194px] flex flex-col justify-between">
                <div>
                    <h2 className="card-title text-lg truncate">{title}</h2>
                    <p className="mt-2 text-sm line-clamp-2">{description}</p>
                </div>

                {/* Action Buttons */}
                <div className="card-actions justify-around mt-auto">
                    {buttons.map((button, index) => (
                        <button
                            key={index}
                            className={`btn btn-sm ${button.variant} ${
                                button.disabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={button.onClick}
                            disabled={button.disabled}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NFTCard;
