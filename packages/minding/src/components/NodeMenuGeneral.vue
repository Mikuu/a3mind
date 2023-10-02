<template>
  <v-container class="px-0">
    <div class="d-flex justify-start align-start mt-2">
      <p class="mt-2 mr-2">Node type:</p>
      <v-radio-group v-model="mindStore.nodeMenu.node.nodeType" inline class="font-weight-light">
        <v-radio label="General" value="general" class="font-weight-light"></v-radio>
        <v-radio label="Scenario" value="scenario" class="font-weight-light"></v-radio>
        <v-radio label="Test" value="test" class="font-weight-light"></v-radio>
      </v-radio-group>
    </div>
    <v-text-field v-model="mindStore.nodeMenu.node.topic" label="Topic" variant="outlined"></v-text-field>
    <v-text-field v-model="mindStore.nodeMenu.node.tags" label="Tags" variant="outlined"></v-text-field>
    <v-text-field v-model="mindStore.nodeMenu.node.icons" label="Icons" variant="outlined"></v-text-field>
    <v-text-field v-model="mindStore.nodeMenu.node.hyperLink" label="Link" variant="outlined"></v-text-field>
    <v-textarea
      v-model="mindStore.nodeMenu.node.memo"
      label="Memo" variant="outlined" auto-grow max-rows="12" class="memo"></v-textarea>
  </v-container>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useMindStore } from "@/store/mind";
import { useViewStore } from "@/store/view";

const mindStore = useMindStore();
const viewStore = useViewStore();

onMounted(() => {
  // console.log(`FBI --> onMounted nodeMenuGeneral starting`);
  // console.log(`FBI --> menuGeneral > mind.currentNode`);
  // console.log(mindStore.mind.currentNode);
})

/**
 * below solution doesn't change topic itself, but need handle further handling to the .reshapeNode function, otherwise
 * each calling of it will overwrite the added icon span and shadow span.
 * */
const prefixIconSolution = (mindStore) => {
  const encodeHTML = (s) => {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  }

  const preSpanContainer = document.createElement('span');
  preSpanContainer.className = 'icons';
  preSpanContainer.innerHTML = [viewStore.config.prefixIcon.test].map(icon => `<span>${encodeHTML(icon)}</span>`).join('');

  const shadowSpan = document.createElement('span');
  shadowSpan.className = 'shadow-span';
  shadowSpan.textContent = mindStore.mind.currentNode.nodeObj.topic;

  // 3 means text node, similarly, 1 means element node.
  if (mindStore.mind.currentNode.firstChild.nodeType === 3) {
    mindStore.mind.currentNode.insertBefore(preSpanContainer, mindStore.mind.currentNode.firstChild);
    mindStore.mind.currentNode.insertBefore(shadowSpan, preSpanContainer);

    mindStore.mind.linkDiv(); // draw lines longer.

  } else {
    mindStore.mind.currentNode.replaceChild(preSpanContainer, mindStore.mind.currentNode.firstChild);
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('节点内容已更改');
        console.log(mutation);
        console.log(`new topic: ${mutation.addedNodes[0].textContent}`);
        // ... continue to replace topic with mutation.addedNodes[0].textContent
      }
    }
  });

  const config = { childList: true };
  observer.observe(shadowSpan, config);
};

watch(() => mindStore.nodeMenu.node.nodeType, (newType, oldType) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { nodeType: newType })

  if (newType === 'test' && !mindStore.mind.currentNode.nodeObj.topic.startsWith(viewStore.config.prefixIcon.test)) {
    const topicWithPrefixIcon = viewStore.config.prefixIcon.test + mindStore.mind.currentNode.nodeObj.topic;
    mindStore.nodeMenu.node.topic = topicWithPrefixIcon;
    mindStore.mind.reshapeNode(mindStore.mind.currentNode, { topic: topicWithPrefixIcon });
  }

  if (newType !== 'test' && mindStore.mind.currentNode.nodeObj.topic.startsWith(viewStore.config.prefixIcon.test)) {
    mindStore.nodeMenu.node.topic = mindStore.nodeMenu.node.topic.replace(viewStore.config.prefixIcon.test, "");
    mindStore.mind.reshapeNode(
        mindStore.mind.currentNode,
        { topic: mindStore.mind.currentNode.nodeObj.topic.replace(viewStore.config.prefixIcon.test, "") }
    );
  }

  // another solution, uncompleted, keep it here just for in case, who knows.
  // if (newType === 'test') {
  //   prefixIconSolution(mindStore);
  // }

});

watch(() => mindStore.nodeMenu.node.topic, (newTopic, oldTopic) => {
  if (!mindStore.mind.currentNode) return

  if (typeof newTopic === "string") {
    const topic = newTopic ? newTopic.trim() : "new node";
    mindStore.mind.currentNode.nodeObj.topic = topic
    mindStore.mind.reshapeNode(mindStore.mind.currentNode, { topic: topic })
  }
});

watch(() => mindStore.nodeMenu.node.tags, (newTags, oldTags) => {
  if (!mindStore.mind.currentNode) return

  if (typeof newTags === "string") {
    const newTagsArray = newTags.split(",")
    mindStore.mind.reshapeNode(mindStore.mind.currentNode, { tags: newTagsArray.filter(tag => tag.trim()) })
  }
});

watch(() => mindStore.nodeMenu.node.icons, (newIcons, oldIcons) => {
  if (!mindStore.mind.currentNode) return
  if (typeof newIcons === "string") {
    const newIconsArray = newIcons.split(",")
    mindStore.mind.reshapeNode(mindStore.mind.currentNode, { icons: newIconsArray.filter(icon => icon) })
  }
});

watch(() => mindStore.nodeMenu.node.hyperLink, (newLink, oldLink) => {
  if (!mindStore.mind.currentNode) return
  if (typeof newLink === "string") {
    mindStore.mind.reshapeNode(mindStore.mind.currentNode, { hyperLink: newLink })
  }
});

watch(() => mindStore.nodeMenu.node.memo, (newMemo, oldMemo) => {
  mindStore.mind.currentNode.nodeObj.memo = newMemo
  mindStore.mind.bus.fire("operation", {
    name: "updateMemo",
    obj: mindStore.mind.currentNode.nodeObj
  })
});

</script>

<style>
.memo {
  width: 360px;
}
.shadow-span {
  display: none;
}
</style>
