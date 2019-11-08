
// Returns a tuple of the next line in the input to process, and absolute motion index
// { input_index: , motion_index: }
let parseJoint = (parent, motion_index, joints, line_index, lines) => {
  
  // Assume we're at a joint position, get the name of the joint
  let name = parent == -1 ? lines[line_index].trim().replace("ROOT ", "") : lines[line_index].trim().replace("JOINT ", "");

  // Get the next indices to consider
  let offset_index = line_index + 2, channels_index = line_index + 3, next_index = line_index + 4;

  // Parse the offset and channel
  let joint_offset = getOffset(lines[offset_index].trim());
  let joint_channels = getChannels(lines[channels_index].trim(), motion_index);

  // The next joint to be processed must have the proper motion index
  motion_index += Object.keys(joint_channels).length;

  // We now have enough info to add this node to the list of joints, hooray!
  joints.push({
    name: name,
    parent: parent,
    offset: joint_offset,
    channels: joint_channels
  });
  
  let my_index = joints.length - 1;

  // We have either (1..n JOINTs) or (1 Endsite). If its just an endsite,
  //   then we can add it right here.
  let next_line = lines[next_index].trim();

  if(next_line == "End Site") {

    joints.push({
      name: "End Site",
      parent: my_index,
      offset: getOffset(lines[next_index + 2].trim()),
      channels: { }
    });

    // Now, return the next line to process
    return {input_index: next_index + 5, motion_index: motion_index};
  } 
  else {

    let endOfJoints = false;
    while(!endOfJoints) {
      // Try to parse the next joint
      let result = parseJoint(my_index, motion_index, joints, next_index, lines);

      motion_index = result.motion_index;
      next_index = result.input_index;

      // We're given the index of the next joint to process. This will either be
      // a closing curly brace, or a joint. If we see joint, continue. Otherwise,
      // we're done here!
      if(lines[next_index].trim() == "}") {
        next_index += 1;
        endOfJoints = true;
        break;
      }
    }

    return {input_index: next_index, motion_index: motion_index};
  }
};

// Gather the XYZ offset, return as a list
let getOffset = (string) => {
  console.log(string);
  let offset = string.split("\t");
  return [parseFloat(offset[1]), parseFloat(offset[2]), parseFloat(offset[3])];
};

// Map the channels to their absolute index in a line of motion data
let getChannels = (string, base_index) => {
  let splt = string.split("\t");
  let qty = parseInt(splt[1]);

  let channels_obj = { };
  for(let i = 0; i < qty; i++) {
    channels_obj[splt[i + 2]] = i + base_index;
  }

  return channels_obj;
}

let parseHeader = (fileString) => {
  // Split into lines
  let lines = fileString.split("\n");

  // Parse this thing recursively
  let joints = [];

  parseJoint(-1, 0, joints, 1, lines);

  return joints;
};

let parseBody = (fileString) => {
  // Split into lines
  let lines = fileString.split("\n");

  // Get the time per frame
  let frame_time = parseFloat(lines[2].split(":")[1]);

  let frames = [];
  for(let i = 3; i < lines.length - 1; i++) {
    if(lines[i].trim() != "" && lines[i].trim() != "\n") {
      frames.push({
        start: (i - 3) * frame_time,
        isEnd: false,
        data: lines[i].split("\t").map(x => parseFloat(x)),
      });
    }
  }

  frames[frames.length - 1].isEnd = true;

  return frames;
};

export default {
  parseBVH(fileString) {
    // Parse the header into a skeleton
    let skeleton = parseHeader(fileString.split("MOTION")[0]);

    // Then parse the body into frames
    let frames = parseBody(fileString.split("MOTION")[1]);

    console.log(frames);

    // Return as a tuple
    return {
      skeleton: skeleton,
      frames: frames,
    };
  }
};